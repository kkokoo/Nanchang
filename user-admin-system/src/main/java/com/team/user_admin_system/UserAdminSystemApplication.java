package com.team.user_admin_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 项目启动类（整个SpringBoot项目的入口）
 * 作用：运行这个类 → 启动整个后端服务
 * 所有Controller、Service、配置都会被自动加载
 */
@SpringBootApplication // SpringBoot核心注解，自动配置、自动扫描、加载项目
public class UserAdminSystemApplication {

    /**
     * main方法：Java程序的入口
     * 运行这里 → 启动SpringBoot项目
     */
    public static void main(String[] args) {
        // 启动SpringBoot应用
        SpringApplication.run(UserAdminSystemApplication.class, args);
    }
}