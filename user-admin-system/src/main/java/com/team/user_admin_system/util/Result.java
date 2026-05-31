package com.team.user_admin_system.util;

/**
 * 统一返回结果封装类
 * 作用：前端和后端约定一套固定的返回格式
 * 所有接口都用这个类返回数据，方便前端处理
 */
public class Result<T> {

    // 响应码：1=成功，0=失败
    private int code;

    // 提示信息：如"操作成功"、"用户不存在"、"密码错误"
    private String msg;

    // 返回的数据：可以是用户对象、列表、null等
    private T data;

    /**
     * 成功：无数据返回
     * 例如：注册成功、修改成功
     */
    public static <T> Result<T> success() {
        return success(null);
    }

    /**
     * 成功：带数据返回
     * 例如：登录成功返回用户信息、查询返回列表
     */
    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.setCode(1);          // 1 = 成功
        r.setMsg("操作成功");  // 默认成功提示
        r.setData(data);       // 返回数据
        return r;
    }

    /**
     * 失败：带错误提示
     * 例如：用户不存在、密码错误、用户名重复
     */
    public static <T> Result<T> fail(String msg) {
        Result<T> r = new Result<>();
        r.setCode(0);          // 0 = 失败
        r.setMsg(msg);         // 错误原因
        r.setData(null);       // 失败无数据
        return r;
    }

    // ———————— 以下是 getter 和 setter ————————
    // 作用：给变量赋值、获取变量值（固定写法）

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}