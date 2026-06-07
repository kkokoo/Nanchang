package com.team.user_admin_system.module.repository;

import com.team.user_admin_system.module.entity.EventPerson;
import com.team.user_admin_system.module.entity.EventPersonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 事件-人物关联表仓库
 */
@Repository
public interface EventPersonRepository extends JpaRepository<EventPerson, EventPersonId> {

    /**
     * 根据事件ID查询关联的所有人物ID
     */
    List<EventPerson> findByEventId(Integer eventId);

    /**
     * 根据人物ID查询关联的所有事件ID
     */
    List<EventPerson> findByPersonId(Integer personId);
}
