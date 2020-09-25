<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *     collectionOperations={"GET", "POST"},
 *     itemOperations={"GET", "PUT", "DELETE"},
 *     subresourceOperations={
         "invoices_get_subresource"={"path"="/customers/{id}/invoices"}
 *     },
 *     normalizationContext={
            "groups"={"customers_read"}
 *     }
 * )
 * @ApiFilter(SearchFilter::class,
 *     properties={"firstName":"partial","lastName":"partial", "company":"partial"})
 * @ApiFilter(OrderFilter::class)
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoices_read"})
     */
    private $id;

    /**
     * @Assert\NotBlank(message="Le prénom du costumer est obligatoire")
     * @Assert\Length(
     *     min="3", minMessage="Le prénom doit faire entre 3 et 255 caractères",
     *     max="255", maxMessage="Le prénom doit faire entre 3 et 255 caractères"
     *     )
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     */
    private $firstName;

    /**
     * @Assert\NotBlank(message="Le prénom du costumer est obligatoire")
     * @Assert\Length(
     *     min="3", minMessage="Le nom doit faire entre 3 et 255 caractères",
     *     max="255", maxMessage="Le nom doit faire entre 3 et 255 caractères"
     *     )
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     */
    private $lastName;

    /**
     * @Assert\NotBlank(message="L'adresse email du costumer est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email est invalide")
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read", "invoices_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @ApiSubresource()
     * @Groups({"customers_read"})
     */
    private $invoices;

    /**
     * @Assert\NotBlank (message="L'utilsateur est obligatoire")
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customers_read"})
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }


    /**
     * @return float
     * @Groups({"customers_read"})
     */
    public function getTotalAmount(): float{
        return array_reduce($this->invoices->toArray(), function ($total,$invoice){
            return $total + $invoice->getAmount();
        },0);
    }

    /**
     * @return float
     * @Groups({"customers_read"})
     */
    public function getAmountDue(): float{
        return array_reduce($this->invoices->toArray(), function ($total,$invoice){
            return $total + ($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELLED" ? 0 : $invoice->getAmount());
        },0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
