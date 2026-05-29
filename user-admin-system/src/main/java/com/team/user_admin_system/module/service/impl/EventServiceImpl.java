package com.team.user_admin_system.module.service.impl;

import org.springframework.stereotype.Service;

import com.team.user_admin_system.module.entity.Event;
import com.team.user_admin_system.module.repository.EventRepository;
import com.team.user_admin_system.module.service.EventService;

import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    // 去掉 @RequiredArgsConstructor，改用手动写的构造方法
    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public List<Event> listAll() {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> listByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

    @Override
    public Event getById(Long id) {
        // 修正 findById 写法
        Optional<Event> optionalEvent = eventRepository.findById(id);
        return optionalEvent.orElse(null);
    }
}