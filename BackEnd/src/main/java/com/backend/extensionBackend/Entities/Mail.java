package com.backend.extensionBackend.Entities;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
public class Mail{

    @Id
    private String id;

    private boolean visit;
}