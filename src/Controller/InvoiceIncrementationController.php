<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceIncrementationController extends AbstractController
{
    /* @var EntityManagerInterface */
    private EntityManagerInterface $manager;

    /**
     * InvoiceIncrementationController constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(Invoice $data): Invoice
    {
        $data->setChrono($data->getChrono()+1);
        $this->manager->flush();
        return $data;
    }
}
