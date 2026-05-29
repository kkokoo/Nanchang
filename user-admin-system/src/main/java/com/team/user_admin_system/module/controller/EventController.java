package com.team.user_admin_system.module.controller;

import org.springframework.web.bind.annotation.*;

import com.team.user_admin_system.module.entity.Event;
import com.team.user_admin_system.module.service.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/event")
public class EventController {

    private final EventService eventService;

    // 手动写构造方法，替代 @RequiredArgsConstructor
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // 查所有事件
    @GetMapping("/list")
    public List<Event> list(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return eventService.listByCategory(category);
        }
        return eventService.listAll();
    }

    // 查单个事件详情
    @GetMapping("/{id}")
    public Event get(@PathVariable Long id) {
        return eventService.getById(id);
    }
}