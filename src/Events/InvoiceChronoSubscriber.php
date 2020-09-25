<?php


namespace App\Events;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private Security $security;
    private InvoiceRepository $invoiceRepository;

    /**
     * InvoiceChronoSubscriber constructor.
     * @param Security $security
     * @param InvoiceRepository $invoiceRepository
     */
    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }


    public static function getSubscribedEvents()
    {
        return [KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]];
    }

    public function setChronoForInvoice(ViewEvent $event){
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && $method === "POST"){
            $user = $this->security->getUser();
            $chrono = $this->invoiceRepository->findNextChrono($user);
            $invoice->setChrono($chrono);

            //TODO à deplacer dans une classe dédiée
            if (empty($invoice->getSentAt())){
                $invoice->setSentAt(new \DateTime());
            }

            $event->setControllerResult($invoice);


        }
    }
}