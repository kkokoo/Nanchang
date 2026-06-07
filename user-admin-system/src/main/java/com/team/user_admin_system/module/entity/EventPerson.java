package com.team.user_admin_system.module.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 事件-人物关联实体类
 * 对应数据库 event_person 表
 */
@Entity
@Table(name = "event_person")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(EventPersonId.class)
public class EventPerson {

    @Id
    @Column(name = "event_id")
    private Integer eventId;

    @Id
    @Column(name = "person_id")
    private Integer personId;
}
