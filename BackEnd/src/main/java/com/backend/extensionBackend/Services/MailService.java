package com.backend.extensionBackend.Services;


import com.backend.extensionBackend.Entities.Mail;
import com.backend.extensionBackend.Repositories.MailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MailService{

    @Autowired
    private MailRepository mailRepository;

    public int isVisited(String id){
        Optional<Mail> mOpt=mailRepository.findById(id);
        if(mOpt.isEmpty()) return -1;
        Mail m=mOpt.get();
        if(m.isVisit()) return 1;
        return 0;
    }

    public void createMail(String id){
        Mail m=new Mail();
        m.setId(id);
        m.setVisit(false);
        mailRepository.save(m);
    }

    public void visit(String id){
        Optional<Mail> mOpt=mailRepository.findById(id);
        if(mOpt.isEmpty()) return;
        Mail m=mOpt.get();
        m.setVisit(true);
        mailRepository.save(m);
    }
}
