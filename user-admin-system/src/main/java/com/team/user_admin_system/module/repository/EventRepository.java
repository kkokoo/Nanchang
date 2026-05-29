package com.team.user_admin_system.module.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.team.user_admin_system.module.entity.Event;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    // 按分类查事件列表
    List<Event> findByCategory(String category);
}