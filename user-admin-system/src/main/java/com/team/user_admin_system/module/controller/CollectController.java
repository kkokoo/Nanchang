package com.team.user_admin_system.module.controller;

import com.team.user_admin_system.module.entity.Collect;
import com.team.user_admin_system.module.entity.Event;
import com.team.user_admin_system.module.entity.Person;
import com.team.user_admin_system.module.repository.CollectRepository;
import com.team.user_admin_system.module.repository.EventRepository;
import com.team.user_admin_system.module.repository.PersonRepository;
import com.team.user_admin_system.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 用户收藏控制器
 */
@RestController
@RequestMapping("/api/collect")
public class CollectController {

    @Autowired
    private CollectRepository collectRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PersonRepository personRepository;

    /**
     * 添加收藏
     */
    @PostMapping("/add")
    public Result<?> addCollect(@RequestBody Map<String, Object> params) {
        try {
            Integer userId = (Integer) params.get("userId");
            String contentTypeStr = (String) params.get("contentType");
            Integer contentId = (Integer) params.get("contentId");
            String folderName = params.getOrDefault("folderName", "默认收藏夹").toString();

            if (userId == null || contentTypeStr == null || contentId == null) {
                return Result.fail("参数不完整");
            }

            Collect.ContentType contentType = Collect.ContentType.valueOf(contentTypeStr);

            // 检查是否已收藏
            Optional<Collect> existing = collectRepository.findByUserIdAndContentTypeAndContentId(userId, contentType, contentId);
            if (existing.isPresent()) {
                return Result.fail("已经收藏过了");
            }

            Collect collect = new Collect();
            collect.setUserId(userId);
            collect.setFolderName(folderName);
            collect.setContentType(contentType);
            collect.setContentId(contentId);
            collect.setCreateTime(LocalDateTime.now());

            collectRepository.save(collect);
            return Result.success();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("收藏失败：" + e.getMessage());
        }
    }

    /**
     * 取消收藏
     */
    @PostMapping("/remove")
    @Transactional
    public Result<?> removeCollect(@RequestBody Map<String, Object> params) {
        try {
            Integer userId = (Integer) params.get("userId");
            String contentTypeStr = (String) params.get("contentType");
            Integer contentId = (Integer) params.get("contentId");

            if (userId == null || contentTypeStr == null || contentId == null) {
                return Result.fail("参数不完整");
            }

            Collect.ContentType contentType = Collect.ContentType.valueOf(contentTypeStr);
            collectRepository.deleteByUserIdAndContentTypeAndContentId(userId, contentType, contentId);
            return Result.success();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("取消收藏失败：" + e.getMessage());
        }
    }

    /**
     * 检查是否已收藏
     */
    @GetMapping("/check")
    public Result<Boolean> checkCollect(
            @RequestParam Integer userId,
            @RequestParam String contentType,
            @RequestParam Integer contentId
    ) {
        try {
            Collect.ContentType type = Collect.ContentType.valueOf(contentType);
            Optional<Collect> existing = collectRepository.findByUserIdAndContentTypeAndContentId(userId, type, contentId);
            return Result.success(existing.isPresent());
        } catch (Exception e) {
            return Result.fail("查询失败");
        }
    }

    /**
     * 获取用户的所有收藏（附带名称信息）
     */
    @GetMapping("/list")
    public Result<List<Map<String, Object>>> getCollects(@RequestParam Integer userId) {
        try {
            List<Collect> collects = collectRepository.findByUserIdOrderByCreateTimeDesc(userId);
            List<Map<String, Object>> result = new ArrayList<>();

            for (Collect collect : collects) {
                Map<String, Object> item = new HashMap<>();
                item.put("collectId", collect.getCollectId());
                item.put("contentType", collect.getContentType().name());
                item.put("contentId", collect.getContentId());
                item.put("folderName", collect.getFolderName());
                item.put("createTime", collect.getCreateTime());

                // 获取收藏内容的名称
                if (collect.getContentType() == Collect.ContentType.event) {
                    Optional<Event> event = eventRepository.findById(Long.valueOf(collect.getContentId()));
                    item.put("contentName", event.map(Event::getEventName).orElse("未知事件"));
                } else {
                    Optional<Person> person = personRepository.findById(Long.valueOf(collect.getContentId()));
                    item.put("contentName", person.map(Person::getName).orElse("未知人物"));
                }

                result.add(item);
            }

            return Result.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("查询收藏列表失败");
        }
    }
}
