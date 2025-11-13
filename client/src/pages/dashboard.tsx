import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Title,
  Text,
  Card,
  CardGrid,
  Div,
  Placeholder,
} from "@vkontakte/vkui";
import {
  Icon28ErrorCircleOutline,
  Icon28MoneyCircleOutline,
  Icon28CoinsOutline,
  Icon28DiamondOutline,
  Icon28StatisticsOutline,
  Icon28CheckCircleOutline,
  Icon28CancelCircleOutline,
  Icon28ClockOutline,
} from "@vkontakte/icons";
import type { FinancialAnalysis, AnalysisData } from "@shared/schema";

export default function Dashboard() {
  const [, params] = useRoute("/analysis/:id");
  const [, setLocation] = useLocation();
  const analysisId = params?.id;

  const { data: analysis, isLoading, isError } = useQuery<FinancialAnalysis>({
    queryKey: [`/api/analyses/${analysisId}`],
    enabled: !!analysisId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if status is pending
      const analysis = query.state.data as FinancialAnalysis | undefined;
      if (analysis?.status === "pending") {
        return 2000;
      }
      return false;
    },
  });

  if (isLoading) {
    return (
      <Panel id="dashboard">
        <PanelHeader before={<PanelHeaderBack onClick={() => setLocation("/")} data-testid="button-back-loading" />}>
          Загрузка...
        </PanelHeader>
        <Div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <Text data-testid="text-loading">Загрузка...</Text>
        </Div>
      </Panel>
    );
  }

  if (isError || !analysis) {
    return (
      <Panel id="dashboard">
        <PanelHeader before={<PanelHeaderBack onClick={() => setLocation("/")} data-testid="button-back-not-found-header" />}>
          Ошибка
        </PanelHeader>
        <Placeholder
          icon={<Icon28ErrorCircleOutline width={56} height={56} />}
          header="Анализ не найден"
          action={
            <div
              onClick={() => setLocation("/")}
              style={{
                color: "var(--vkui--color_text_accent)",
                cursor: "pointer",
                fontSize: "15px",
              }}
              data-testid="button-back-not-found"
            >
              Вернуться на главную
            </div>
          }
          data-testid="placeholder-not-found"
        >
          Не удалось загрузить данные анализа
        </Placeholder>
      </Panel>
    );
  }

  if (analysis.status === "pending") {
    return (
      <Panel id="dashboard">
        <PanelHeader before={<PanelHeaderBack onClick={() => setLocation("/")} data-testid="button-back-pending" />}>
          Обработка
        </PanelHeader>
        <Placeholder
          icon={<Icon28ClockOutline width={56} height={56} />}
          header="Анализ в процессе"
          data-testid="placeholder-pending"
        >
          Документ обрабатывается, пожалуйста подождите...
        </Placeholder>
      </Panel>
    );
  }

  if (analysis.status === "failed") {
    return (
      <Panel id="dashboard">
        <PanelHeader before={<PanelHeaderBack onClick={() => setLocation("/")} data-testid="button-back-failed" />}>
          Ошибка
        </PanelHeader>
        <Placeholder
          icon={<Icon28CancelCircleOutline width={56} height={56} />}
          header="Ошибка анализа"
          action={
            <div
              onClick={() => setLocation("/")}
              style={{
                color: "var(--vkui--color_text_accent)",
                cursor: "pointer",
                fontSize: "15px",
              }}
              data-testid="button-back-error"
            >
              Вернуться на главную
            </div>
          }
          data-testid="placeholder-error"
        >
          {analysis.errorMessage || "Произошла ошибка при анализе документа"}
        </Placeholder>
      </Panel>
    );
  }

  const data = analysis.analysisData as AnalysisData;

  const getGradeStyle = (grade: string | null) => {
    if (!grade) return {};

    const styles = {
      "Покупать": {
        backgroundColor: "var(--vkui--color_background_positive)",
        color: "var(--vkui--color_text_positive)",
        icon: <Icon28CheckCircleOutline />,
      },
      "Держать": {
        backgroundColor: "var(--vkui--color_background_warning)",
        color: "var(--vkui--color_text_warning)",
        icon: <Icon28ClockOutline />,
      },
      "Продавать": {
        backgroundColor: "var(--vkui--color_background_negative)",
        color: "var(--vkui--color_text_negative)",
        icon: <Icon28CancelCircleOutline />,
      },
    };

    return styles[grade as keyof typeof styles] || {};
  };

  const gradeStyle = getGradeStyle(data.section_3.investment_grade);

  return (
    <Panel id="dashboard">
      <PanelHeader before={<PanelHeaderBack onClick={() => setLocation("/")} data-testid="button-back" />}>
        {analysis.fileName}
      </PanelHeader>

      <Group>
        <Div>
          <div
            style={{
              ...gradeStyle,
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            data-testid="banner-investment-grade"
          >
            {gradeStyle.icon}
            <Text weight="2" style={{ fontSize: "24px", textTransform: "uppercase", letterSpacing: "0.5px" }} data-testid="text-investment-grade">
              {data.section_3.investment_grade || "Не определено"}
            </Text>
          </div>
        </Div>
      </Group>

      <Group header={<Title level="2" weight="2" style={{ padding: "12px 16px", fontSize: "20px" }}>Ключевые показатели</Title>}>
        <CardGrid size="l">
          <MetricCard
            icon={<Icon28MoneyCircleOutline fill="var(--vkui--color_icon_accent)" />}
            label="Выручка"
            value={data.section_1.main_indicators.revenue || "Нет данных"}
            testId="metric-revenue"
          />
          <MetricCard
            icon={<Icon28CoinsOutline fill="var(--vkui--color_icon_positive)" />}
            label="Чистая прибыль"
            value={data.section_1.main_indicators.net_profit || "Нет данных"}
            testId="metric-net-profit"
          />
          <MetricCard
            icon={<Icon28StatisticsOutline fill="var(--vkui--color_icon_secondary)" />}
            label="EBITDA"
            value={data.section_1.main_indicators.ebitda || "Нет данных"}
            testId="metric-ebitda"
          />
          <MetricCard
            icon={<Icon28DiamondOutline fill="var(--vkui--color_icon_accent_alternate)" />}
            label="Маржинальность"
            value={data.section_1.main_indicators.profit_margin || "Нет данных"}
            testId="metric-margin"
          />
        </CardGrid>
      </Group>

      <Group>
        <Card mode="outline">
          <Div>
            <Title level="2" weight="2" style={{ marginBottom: "16px", fontSize: "20px" }}>
              {data.section_1.title}
            </Title>
            <div style={{ marginBottom: "16px" }}>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Динамика
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_1.dynamics || "Нет данных"}
              </Text>
            </div>
            <div>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Позиция в отрасли
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_1.industry_position || "Нет данных"}
              </Text>
            </div>
          </Div>
        </Card>
      </Group>

      <Group>
        <Card mode="outline">
          <Div>
            <Title level="2" weight="2" style={{ marginBottom: "16px", fontSize: "20px" }}>
              {data.section_2.title}
            </Title>
            <div style={{ marginBottom: "16px" }}>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Выявленные риски
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_2.red_flags_summary || "Нет данных"}
              </Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Степень серьезности
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_2.risk_severity || "Нет данных"}
              </Text>
            </div>
            <div>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Рекомендации
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_2.additional_check_recommendations || "Нет данных"}
              </Text>
            </div>
          </Div>
        </Card>
      </Group>

      <Group>
        <Card mode="outline">
          <Div>
            <Title level="2" weight="2" style={{ marginBottom: "16px", fontSize: "20px" }}>
              {data.section_3.title}
            </Title>
            <div style={{ marginBottom: "16px" }}>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Финансовое состояние
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_3.financial_health || "Нет данных"}
              </Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Возможности и угрозы
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_3.opportunities_and_threats || "Нет данных"}
              </Text>
            </div>
            <div>
              <Text weight="2" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--vkui--color_text_secondary)" }}>
                Инвестиционные выводы
              </Text>
              <Text style={{ fontSize: "15px", lineHeight: "1.5" }}>
                {data.section_3.investment_conclusion || "Нет данных"}
              </Text>
            </div>
          </Div>
        </Card>
      </Group>
    </Panel>
  );
}

function MetricCard({
  icon,
  label,
  value,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  testId?: string;
}) {
  return (
    <Card mode="shadow">
      <Div style={{ minHeight: "140px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>{icon}</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Text weight="3" style={{ fontSize: "28px", marginBottom: "4px" }} data-testid={testId}>
            {value}
          </Text>
          <Text style={{ fontSize: "13px", color: "var(--vkui--color_text_secondary)" }}>
            {label}
          </Text>
        </div>
      </Div>
    </Card>
  );
}
