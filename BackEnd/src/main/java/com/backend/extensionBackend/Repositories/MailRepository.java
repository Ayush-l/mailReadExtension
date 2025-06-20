package com.backend.extensionBackend.Repositories;

import com.backend.extensionBackend.Entities.Mail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MailRepository extends MongoRepository<Mail,String> {
}