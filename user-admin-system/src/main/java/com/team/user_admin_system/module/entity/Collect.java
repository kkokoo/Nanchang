package com.team.user_admin_system.module.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 用户收藏实体类
 * 对应数据库 collect 表
 */
@Entity
@Table(name = "collect")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Collect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer collectId;

    @Column(nullable = false)
    private Integer userId;

    @Column(name = "folder_name", length = 50, nullable = false)
    private String folderName;

    @Column(name = "content_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ContentType contentType;

    @Column(name = "content_id", nullable = false)
    private Integer contentId;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    public enum ContentType {
        event, person
    }
}
