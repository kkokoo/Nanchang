package com.team.user_admin_system.module.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * 事件-人物关联表的复合主键类
 */
public class EventPersonId implements Serializable {

    private Integer eventId;
    private Integer personId;

    public EventPersonId() {}

    public EventPersonId(Integer eventId, Integer personId) {
        this.eventId = eventId;
        this.personId = personId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EventPersonId that = (EventPersonId) o;
        return Objects.equals(eventId, that.eventId) && Objects.equals(personId, that.personId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, personId);
    }
}
