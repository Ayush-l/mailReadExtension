package com.backend.extensionBackend.Controllers;

import com.backend.extensionBackend.Services.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/mail")
@CrossOrigin(origins = "*")
public class MailController {

    @Autowired
    private MailService mailService;

    @PostMapping("/create/{id}")
    public ResponseEntity<Void> createMail(@PathVariable String id) {
        mailService.createMail(id);
        log.info("Created new mail ID: {}", id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/visit/{id}")
    public ResponseEntity<Void> markAsVisited(@PathVariable String id) {
        mailService.visit(id);
        log.info("Marked visited for ID: {}", id);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @GetMapping("/isvisited/{id}")
    public ResponseEntity<Integer> isVisited(@PathVariable String id) {
        int visited = mailService.isVisited(id);
        log.info("Checked isVisited for ID: {} => {}", id, visited);
        if(visited==-1) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(visited, HttpStatus.OK);
    }
}
