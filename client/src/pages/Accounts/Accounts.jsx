import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import SocialAccountCard from "../../components/SocialAccountCard";

const providers = [
  "twitter",
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "youtube",
];

export default function Accounts() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["social_accounts"],
    queryFn: async () => {
      const res = await socialAPI.list();
      return res.data.accounts;
    },
    enabled: !!user,
  });

  const disconnectMutation = useMutation({
    mutationFn: (provider) => socialAPI.disconnect(provider),
    onSuccess: () => qc.invalidateQueries(["social_accounts"]),
  });

  const syncMutation = useMutation({
    mutationFn: (provider) => socialAPI.refresh(provider),
    onSuccess: () => qc.invalidateQueries(["social_accounts"]),
  });

  const handleConnect = async (provider) => {
    // Open start endpoint in new tab (server should redirect to provider auth URL)
    const url = `${
      import.meta.env.VITE_API_URL || "http://localhost:5001"
    }/api/social/start/${provider}`;
    window.open(url, "_blank");
  };

  if (isLoading)
    return <div className="p-6">Loading connected accounts...</div>;
  if (isError)
    return <div className="p-6 text-red-600">Failed to load accounts</div>;

  const accounts = data || [];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Connected Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => {
          const acct = accounts.find((a) => a.platform === p);
          return (
            <SocialAccountCard
              key={p}
              provider={p}
              account={acct}
              onConnect={handleConnect}
              onDisconnect={(prov) => disconnectMutation.mutate(prov)}
              onSync={(prov) => syncMutation.mutate(prov)}
              syncing={syncMutation.isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
