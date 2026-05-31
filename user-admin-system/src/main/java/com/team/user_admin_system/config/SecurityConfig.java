package com.team.user_admin_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 安全配置类
 * 功能：密码加密、跨站请求伪造关闭、请求权限放行
 * 用于支持用户登录注册的密码加密，同时不拦截前端请求
 */
@Configuration
@EnableWebSecurity // 开启Spring Security安全认证功能
public class SecurityConfig {

    /**
     * 密码加密工具 Bean
     * 使用 BCrypt 强哈希算法，自动加盐，每次加密结果不同
     * 用于：用户注册加密、登录密码比对
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Spring Security 新版核心配置
     * 替代旧版 WebSecurityConfigurerAdapter（已废弃）
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 关闭CSRF防护（前后端分离项目必须关闭，否则接口无法访问）
            .csrf(csrf -> csrf.disable())
            
            // 配置请求授权规则
            .authorizeHttpRequests(auth -> auth
                // 所有请求全部放行，不做登录拦截
                // 适合开发阶段，后续可根据需要添加权限控制
                .anyRequest().permitAll()
            );
        
        // 构建并返回安全配置
        return http.build();
    }
}