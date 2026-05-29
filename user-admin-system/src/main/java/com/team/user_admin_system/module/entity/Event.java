package com.team.user_admin_system.module.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;    // 事件标题
    private String content;  // 事件内容
    private String imgUrl;   // 图片地址
    private LocalDate eventTime; // 发生时间
    private String category; // 分类（如“八一专题”）

    // Getter 和 Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImgUrl() { return imgUrl; }
    public void setImgUrl(String imgUrl) { this.imgUrl = imgUrl; }

    public LocalDate getEventTime() { return eventTime; }
    public void setEventTime(LocalDate eventTime) { this.eventTime = eventTime; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}