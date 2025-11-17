package com.mosqueteros_inc.sparkevents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan("com.mosqueteros_inc")
@EnableJpaRepositories("com.mosqueteros_inc.repository")
@EntityScan("com.mosqueteros_inc.model") 
public class SparkeventsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SparkeventsApplication.class, args);
    }

}
