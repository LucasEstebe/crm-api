<?php


namespace App\Events;


use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event){
        $user = $event->getUser();
        $data = $event->getData();

        if ($user instanceof User){
            $data['firstName'] = $user->getFirstName();
            $data['lastName'] = $user->getLastName();

            $event->setData($data);
        }

    }
}