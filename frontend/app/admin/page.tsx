"use client";

import {  useAppSelector } from "@/lib/hooks";

const Dashboard = () => {
  const {user}=useAppSelector((state)=>state.auth)

  console.log({user})
  return <div>{user?.role}</div>;
};

export default Dashboard;
