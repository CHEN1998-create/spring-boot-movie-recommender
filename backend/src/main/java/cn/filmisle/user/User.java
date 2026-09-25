package cn.filmisle.user;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 用户实体（PRD users 表）。
 * 说明：登录模块未上线，本阶段仅承载"演示身份"——
 * behavior 接口通过 X-User-Id 请求头识别用户，未传时落到演示用户。
 * passwordHash 字段为 auth 模块预留。
 */
@Entity
@Table(name = "users")
public class User {

    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120, unique = true)
    private String email;

    /** auth 模块接入前为 null */
    @Column(name = "password_hash")
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public User() {
    }

    public User(String email, String nickname, String role, LocalDateTime createdAt) {
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.createdAt = createdAt;
    }

    // ---------- getter / setter ----------

    public Long getId() { return id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
