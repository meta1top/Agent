"use client";

import { FC, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import type { LoginData } from "@meta-1/agent-types";
import { LoginSchema } from "@meta-1/agent-types";
import { Button, Card, Input, toast } from "@meta-1/design";
import { useQuery as useWebQuery } from "@meta-1/web-common/hooks";
import { login, profile } from "@/rest/account";
import { getCommonConfig } from "@/rest/public";
import { isLoginState, profileState } from "@/state/profile";

const LoginForm: FC = () => {
  const setIsLogin = useSetAtom(isLoginState);
  const setProfile = useSetAtom(profileState);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
    otpCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = LoginSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message || "表单验证失败");
      return;
    }

    setIsLoading(true);
    try {
      await login(result.data);
      const profileResult = await profile();
      const profileData = profileResult?.data || null;
      setIsLogin(!!profileData);
      setProfile(profileData);
      toast.success("登录成功");
      setFormData({
        email: "",
        password: "",
        otpCode: "",
      });
      window.location.reload();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "登录失败，请检查邮箱和密码";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="p-6">
        <h2 className="mb-6 font-semibold text-2xl text-gray-800 dark:text-white">登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300" htmlFor="email">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={isLoading}
                id="email"
                onChange={(value) => setFormData({ ...formData, email: value })}
                placeholder="请输入邮箱"
                required
                type="email"
                value={formData.email}
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300" htmlFor="password">
                密码 <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={isLoading}
                id="password"
                onChange={(value) => setFormData({ ...formData, password: value })}
                placeholder="请输入密码"
                required
                type="password"
                value={formData.password}
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300" htmlFor="otpCode">
                OTP验证码（可选）
              </label>
              <Input
                disabled={isLoading}
                id="otpCode"
                maxLength={6}
                onChange={(value) => setFormData({ ...formData, otpCode: value })}
                placeholder="请输入6位数字验证码"
                type="text"
                value={formData.otpCode || ""}
              />
            </div>

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

const DemoPage: FC = () => {
  const isLogin = useAtomValue(isLoginState);
  const profileData = useAtomValue(profileState);
  const { data: commonConfig } = useWebQuery({
    queryKey: ["common:config"],
    queryFn: () => getCommonConfig(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-gray-600 text-xl dark:text-gray-300">这是一个演示页面，展示系统的基本功能</p>
          </div>

          {!isLogin && (
            <div className="mb-8 flex justify-center">
              <LoginForm />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 font-semibold text-2xl text-gray-800 dark:text-white">登录状态</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">状态：</span>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-sm ${
                      isLogin
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {isLogin ? "已登录" : "未登录"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 font-semibold text-2xl text-gray-800 dark:text-white">用户信息</h2>
              {profileData ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">用户名：</span>
                    <span className="font-medium text-gray-900 dark:text-white">{profileData.username}</span>
                  </div>
                  {profileData.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">邮箱：</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profileData.email}</span>
                    </div>
                  )}
                  {profileData.role && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">角色：</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profileData.role}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">暂无用户信息</p>
              )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg md:col-span-2 dark:bg-gray-800">
              <h2 className="mb-4 font-semibold text-2xl text-gray-800 dark:text-white">公共配置</h2>
              {commonConfig ? (
                <div className="space-y-2">
                  {commonConfig.publicKey && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">公钥：</span>
                      <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-gray-900 text-sm dark:bg-gray-700 dark:text-gray-100">
                        {commonConfig.publicKey}
                      </code>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">加载中...</p>
              )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg md:col-span-2 dark:bg-gray-800">
              <h2 className="mb-4 font-semibold text-2xl text-gray-800 dark:text-white">功能特性</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-200">React Query</h3>
                  <p className="text-blue-700 text-sm dark:text-blue-300">强大的数据获取和缓存管理</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <h3 className="mb-2 font-semibold text-green-900 dark:text-green-200">Jotai</h3>
                  <p className="text-green-700 text-sm dark:text-green-300">轻量级的状态管理方案</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <h3 className="mb-2 font-semibold text-purple-900 dark:text-purple-200">Next.js</h3>
                  <p className="text-purple-700 text-sm dark:text-purple-300">React 全栈框架</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
