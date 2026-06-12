
package com.team.user_admin_system.service;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ZhipuAIService {

    @Value("${qwen.api-key}")
    private String apiKey;

    @Value("${qwen.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String chatWithAI(String userMessage, List<Map<String, String>> history) {
        List<Map<String, String>> messages = new ArrayList<>();

        //洪小星系统人设
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", """
            你是洪小星，南昌历史小管家。
            任务：
            1. 只回答南昌历史、八一南昌起义、红色文化、英雄城故事。
            2. 回答简洁、口语化、可爱。
            3. 不知道就说"这个我还没学到哦～"
            4. 不回答无关内容（游戏、娱乐、八卦、暴力、色情等）。
            """);
        messages.add(systemMsg);

        if (history != null && !history.isEmpty()) {
            messages.addAll(history);
        }

        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userMessage);
        messages.add(userMsg);

        //构建请求body
        Map<String, Object> body = new HashMap<>();
        body.put("model", "qwen-turbo");
        body.put("messages", messages);
        body.put("temperature", 0.7);
        body.put("max_tokens", 512);

        //设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            String url = baseUrl.endsWith("/") ? baseUrl + "chat/completions" : baseUrl + "/chat/completions";
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JSONObject json = JSON.parseObject(response.getBody());
            JSONArray choices = json.getJSONArray("choices");
            if (choices != null && !choices.isEmpty()) {
                JSONObject msg = choices.getJSONObject(0).getJSONObject("message");
                return msg.getString("content");
            }
            return "洪小星暂时掉线啦，稍后再试试~";
        } catch (Exception e) {
            e.printStackTrace();
            return "洪小星暂时掉线啦，稍后再试试~";
        }
    }
}