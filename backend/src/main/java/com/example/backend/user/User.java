package com.example.backend.user;


import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;

    public User() {}
    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }
    public Long getId() {return this.id;};
    public String getEmail() {return this.email;};

    public void setPassword(String password) {
        this.password = password;
    }
}
