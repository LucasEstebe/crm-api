<?php


namespace App\Doctrine;


use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private Security $security;

    private AuthorizationCheckerInterface $auth;

    /**
     * CurrentUserExtension constructor.
     * @param Security $security
     * @param AuthorizationCheckerInterface $auth
     */
    public function __construct(Security $security, AuthorizationCheckerInterface $auth)
    {
        $this->security = $security;
        $this->auth = $auth;
    }


    private function addWhere(QueryBuilder  $queryBuilder, string $resourceClass){
        //1. get connected user
        $user = $this->security->getUser();
        // modify the query according to the user
        if (($resourceClass === Customer::class || $resourceClass === Invoice::class) //if requesting Customers or Invoices
            && $user instanceof User //if is a connected user
            && !$this->auth->isGranted('ROLE_ADMIN')) //if its not an admin
        {
            $rootAlias = $queryBuilder->getRootAliases()[0];

            if ($resourceClass === Customer::class){
                $queryBuilder->andWhere("$rootAlias.user = :user");
            }elseif ($resourceClass === Invoice::class){
                $queryBuilder->join("$rootAlias.customer", "c")
                    ->andWhere("c.user = :user");
            }
            $queryBuilder->setParameter("user", $user);
        }
    }


    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        $this->addWhere($queryBuilder,$resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder,$resourceClass);
    }
}