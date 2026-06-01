import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "@/components/screen-container";

type FeatureCardData = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  body: string;
  tag: string;
  tone: "blue" | "amber" | "green" | "dark";
  accent?: boolean;
};

const featureCards: FeatureCardData[] = [
  {
    icon: "briefcase-outline",
    title: "Track Applications",
    body: "Every application in one place — company, role, status, and notes. Never lose sight of the next move.",
    tag: "Core",
    tone: "blue",
  },
  {
    icon: "clock-outline",
    title: "Manage Follow-Ups",
    body: "Schedule reminders so recruiter conversations stay warm and nothing slips through the cracks.",
    tag: "Reminders",
    tone: "amber",
  },
  {
    icon: "chart-line",
    title: "Analyze Your Pipeline",
    body: "See success rates, interview conversion, and momentum at a glance. Know what’s working, quickly.",
    tag: "Analytics",
    tone: "green",
    accent: true,
  },
  {
    icon: "flash",
    title: "Fast & Responsive",
    body: "Built for quick one-handed use on the move. A mobile experience from day one, not a desktop repackaged.",
    tag: "Mobile-first",
    tone: "dark",
  },
];

export default function IndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <ScreenContainer className="bg-[#f7f6f2]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          <View className="bg-[#f7f6f2]/95 border-b border-[#e4e1dc] px-5 py-4">
            <View className="flex-row items-center justify-between">
              <Pressable onPress={() => router.push("/login" as never)} className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-xl bg-[#0e0f11] items-center justify-center">
                  <MaterialCommunityIcons name="briefcase-outline" size={16} color="#f7f6f2" />
                </View>
                <Text className="text-[17px] font-bold text-[#0e0f11]">Pipeline Pro</Text>
              </Pressable>

              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => router.push("/login" as never)}
                  className="bg-[#d4efe4] border border-[#b2ddc9] rounded-full px-3.5 py-2 flex-row items-center gap-2 active:opacity-80"
                >
                  <MaterialCommunityIcons name="check-circle-outline" size={13} color="#1a6b4a" />
                  <Text className="text-[13px] font-semibold text-[#1a6b4a]">Owner access</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/login" as never)}
                  className="bg-[#eeecea] border border-[#e4e1dc] rounded-full px-3.5 py-2 flex-row items-center gap-2 active:opacity-80"
                >
                  <MaterialCommunityIcons name="cellphone" size={13} color="#3a3d44" />
                  <Text className="text-[13px] font-medium text-[#3a3d44]">Local sign-in</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="px-5 pt-[120px] pb-[88px]">
            <View className="items-center">
              <View className="bg-[#d4efe4] border border-[#b2ddc9] rounded-full px-4 py-1.5 mb-11">
                <Text className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#1a6b4a]">
                  Job search intelligence
                </Text>
              </View>

              <Text className="text-[42px] leading-[48px] font-extrabold text-[#0e0f11] text-center max-w-[820px]">
                Master your{" "}
                <Text className="italic font-normal text-[#2d9966]">job search</Text>
                {" "}pipeline
              </Text>

              <Text className="text-[17px] leading-8 text-[#3a3d44] text-center max-w-[520px] mt-11">
                Track applications, manage follow-ups, and land your dream role. Pipeline Pro keeps you
                organised and one step ahead.
              </Text>

              <View className="flex-row flex-wrap justify-center gap-3 mt-[60px]">
                <Pressable
                  onPress={() => router.push("/login" as never)}
                  className="bg-[#0e0f11] rounded-[10px] px-6 py-3.5 flex-row items-center gap-2 active:opacity-80"
                >
                  <Text className="text-[#f7f6f2] text-[15px] font-bold">Start free</Text>
                  <MaterialCommunityIcons name="arrow-right" size={14} color="#f7f6f2" />
                </Pressable>

                <Pressable
                  onPress={() => router.push("/login" as never)}
                  className="bg-[#eeecea] border border-[#e4e1dc] rounded-[10px] px-6 py-3.5 flex-row items-center gap-2 active:opacity-80"
                >
                  <MaterialCommunityIcons name="cellphone" size={14} color="#0e0f11" />
                  <Text className="text-[#0e0f11] text-[15px] font-semibold">Download mobile app</Text>
                </Pressable>
              </View>

              <View
                className="bg-white border border-[#e4e1dc] rounded-2xl px-6 py-5 flex-row items-center justify-center gap-6 mt-14"
                style={{boxshadow: "0px 10px 30px rgba(0,0,0,0,08)",}}
              >
                <StatBlock value="4" label="Pipeline stages" />
                <View className="w-px h-9 bg-[#e4e1dc]" />
                <StatBlock value="∞" label="Applications" />
                <View className="w-px h-9 bg-[#e4e1dc]" />
                <StatBlock value="0ms" label="Sync delay" />
              </View>
            </View>

            <View
              className="mt-11 self-center w-full max-w-[520px] rounded-2xl border border-[#e4e1dc] bg-white overflow-hidden"
              style={{
                shadowColor: "#0e0f11",
                shadowOpacity: 0.07,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
              }}
            >
              <View className="flex-row items-stretch">
                <PipelineStage value="3" label="Applied" tone="blue" />
                <PipelineStage value="2" label="Interview" tone="amber" />
                <PipelineStage value="1" label="Offer" tone="green" />
                <PipelineStage value="1" label="Rejected" tone="red" last />
              </View>
            </View>
          </View>

          <View className="px-5 py-16 max-w-[1100px] self-center w-full">
            <View className="items-center mb-8">
              <Text className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#7a7f8a]">
                Powerful features
              </Text>
              <Text className="text-[32px] leading-[36px] font-extrabold text-[#0e0f11] text-center mt-3">
                Built for the{" "}
                <Text className="italic font-normal text-[#1a6b4a]">human</Text>
                {" "}behind the resume
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-between gap-4">
              {featureCards.map((card) => (
                <FeatureCard key={card.title} isWide={isWide} {...card} />
              ))}
            </View>
          </View>

          <View className="bg-[#0e0f11] px-5 py-14 relative overflow-hidden">
            <View
              pointerEvents="none"
              className="absolute inset-0 opacity-20 flex-row flex-wrap justify-center content-center px-10 py-10"
            >
              {Array.from({ length: 28 }).map((_, index) => (
                <View
                  key={`dot-${index}`}
                  className="w-1.5 h-1.5 rounded-full bg-white/40 m-2"
                />
              ))}
            </View>

            <View className="max-w-[440px] self-center w-full items-center relative z-10">
              <Text className="text-[34px] leading-[40px] font-extrabold text-[#f7f6f2] text-center">
                Ready to get{" "}
                <Text className="italic font-normal text-[#7dd4ab]">organised?</Text>
              </Text>
              <Text className="text-[15px] leading-7 text-[#f7f6f2]/55 text-center mt-4">
                Choose how you want to access Pipeline Pro. No portal needed — start in seconds.
              </Text>

              <View className="w-full gap-3 mt-8">
                <Pressable
                  onPress={() => router.push("/login" as never)}
                  className="bg-[#1a6b4a] border border-[#2d9966] rounded-[12px] px-5 py-4 flex-row items-center justify-between active:opacity-80"
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons name="check-circle-outline" size={18} color="#f7f6f2" />
                    <Text className="text-[#f7f6f2] text-[14px] font-semibold">Owner access</Text>
                    <View className="bg-white/12 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] tracking-[0.06em] font-bold text-[#f7f6f2]/75">
                        RECOMMENDED
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[#f7f6f2]/55 text-[16px]">→</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/login" as never)}
                  className="bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 flex-row items-center justify-between active:opacity-80"
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons name="cellphone" size={18} color="#f7f6f2" />
                    <Text className="text-[#f7f6f2] text-[14px] font-medium">Local sign-in</Text>
                    <View className="bg-white/12 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] tracking-[0.06em] font-bold text-[#f7f6f2]/75">
                        NO PORTAL
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[#f7f6f2]/55 text-[16px]">→</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="bg-[#0e0f11] border-t border-white/5 px-5 py-5">
            <View className="max-w-[1100px] self-center w-full flex-row items-center justify-between">
              <Text className="text-[14px] font-semibold text-white/40">Pipeline Pro</Text>
              <Text className="text-[11px] font-mono text-white/25">© 2026 — All rights reserved</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-[28px] font-medium text-[#0e0f11] leading-none">{value}</Text>
      <Text className="text-[12px] text-[#7a7f8a] mt-1">{label}</Text>
    </View>
  );
}

function PipelineStage({
  value,
  label,
  tone,
  last,
}: {
  value: string;
  label: string;
  tone: "blue" | "amber" | "green" | "red";
  last?: boolean;
}) {
  const barColor = {
    blue: "#378ADD",
    amber: "#BA7517",
    green: "#1a6b4a",
    red: "#A32D2D",
  }[tone];

  return (
    <View className={`flex-1 items-center gap-2 py-4 ${last ? "" : "border-r border-[#e4e1dc]"}`}>
      <Text className="text-[22px] font-medium text-[#0e0f11] leading-none">{value}</Text>
      <View className="w-5/6 h-[12px] rounded-full" style={{ backgroundColor: barColor }} />
      <Text className="text-[11px] text-[#7a7f8a]">{label}</Text>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  tag,
  tone,
  accent,
  isWide,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  body: string;
  tag: string;
  tone: "blue" | "amber" | "green" | "dark";
  accent?: boolean;
  isWide: boolean;
}) {
  const wrapperTone = {
    blue: "bg-[#f7f6f2] border-[#e4e1dc]",
    amber: "bg-[#f7f6f2] border-[#e4e1dc]",
    green: "bg-[#1a6b4a] border-[#1a6b4a]",
    dark: "bg-[#0e0f11] border-[#0e0f11]",
  }[tone];

  const iconTone = {
    blue: "bg-[#dce8f8]",
    amber: "bg-[#fde8d6]",
    green: "bg-[#d4efe4]/15",
    dark: "bg-white/8",
  }[tone];

  const iconColor = tone === "green" || tone === "dark" ? "#f7f6f2" : tone === "amber" ? "#b85c1a" : "#1a4a8a";
  const titleColor = tone === "green" || tone === "dark" ? "text-[#f7f6f2]" : "text-[#0e0f11]";
  const bodyColor = tone === "green" || tone === "dark" ? "text-[#f7f6f2]/70" : "text-[#3a3d44]";
  const tagColor = tone === "green" || tone === "dark" ? "bg-white/10 text-[#f7f6f2]/70" : "bg-[#eeecea] text-[#7a7f8a]";
  const cardWidth = !isWide || accent ? "100%" : "48.5%";
  const cardShadow =
    tone === "dark"
      ? {
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
        }
      : {
          shadowColor: "#0e0f11",
          shadowOpacity: 0.09,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
        };

  return (
    <View style={{ width: cardWidth, ...cardShadow }} className={`rounded-2xl border p-8 ${wrapperTone}`}>
      {tone === "dark" ? (
        <View className="flex-row gap-5 items-start">
          <View className="flex-1">
            <View className={`w-12 h-12 rounded-[12px] items-center justify-center mb-5 ${iconTone}`}>
              <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
            </View>
            <Text className={`text-[18px] font-bold mb-2 ${titleColor}`}>{title}</Text>
            <Text className={`text-[14px] leading-6 ${bodyColor}`}>{body}</Text>
            <Text className={`self-start mt-4 px-2.5 py-1 rounded-full text-[10px] tracking-[0.08em] font-bold ${tagColor}`}>
              {tag.toUpperCase()}
            </Text>
          </View>

          <View className="w-[160px] gap-3 pt-1">
            <MiniNotice tone="light" title="New callback" body="Google — Senior PM" />
            <MiniNotice tone="muted" title="Follow-up due" body="Meta — tomorrow" />
            <MiniNotice tone="muted" title="Interview updated" body="Apple — moved to next step" />
          </View>
        </View>
      ) : (
        <>
          <View className={`w-12 h-12 rounded-[12px] items-center justify-center mb-5 ${iconTone}`}>
            <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
          </View>
          <Text className={`text-[18px] font-bold mb-2 ${titleColor}`}>{title}</Text>
          <Text className={`text-[14px] leading-6 ${bodyColor}`}>{body}</Text>
          <Text className={`self-start mt-4 px-2.5 py-1 rounded-full text-[10px] tracking-[0.08em] font-bold ${tagColor}`}>
            {tag.toUpperCase()}
          </Text>
        </>
      )}
    </View>
  );
}

function MiniNotice({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "light" | "muted";
}) {
  const styles =
    tone === "light"
      ? "bg-white/12 border-white/15"
      : "bg-white/8 border-white/10";

  return (
    <View className={`rounded-2xl border px-3 py-2 ${styles}`}>
      <Text className="text-[10px] font-bold text-white/85">{title}</Text>
      <Text className="text-[10px] text-white/55 mt-0.5 leading-4">{body}</Text>
    </View>
  );
}
