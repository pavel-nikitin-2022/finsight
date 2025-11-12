import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FINANCIAL_ANALYSIS_PROMPT = `Ты — финансовый аналитик. Тебе предоставлен текст финансового документа (например, годовой или квартальный отчет).

Твоя задача — проанализировать документ и вернуть строго структурированный JSON-отчет по следующему шаблону.

Правила:
1. Отвечай только в формате JSON, без пояснений, комментариев или текста вне JSON.
2. Все текстовые поля должны быть краткими, информативными и в деловом стиле.
3. Если данных в документе недостаточно — заполняй поле значением null, добавь валидацию ошибки, если документ не является финансовым отчетом или отчет не полный (отсутствует больше половины необходимых показателей)
4. Сохраняй структуру и ключи строго в указанном формате (названия ключей и порядок не меняй).
5. Все числовые значения округляй до двух знаков после запятой.
6. В section_1.main_indicators должны быть ровно 4 финансовых показателя. Если документа недостаточно для всех 4, ставь null. Индикаторы должны быть в следующем формате: 3 597,00 млрд руб. Для EBITDA используй формат: 26,90%
7. Не добавляй никаких новых ключей, разделов или метаданных.

Формат ответа:

{
  "section_1": {
    "title": "Общая характеристика",
    "main_indicators": {
      "revenue": "выручка",
      "net_profit": "чистая прибыль",
      "ebitda": "EBITDA",
      "profit_margin": "маржинальность"
    },
    "dynamics": "Описание динамики изменений по сравнению с предыдущими периодами",
    "industry_position": "Описание позиции компании в отрасли"
  },
  "section_2": {
    "title": "Анализ рисков",
    "red_flags_summary": "Описание выявленных рисков и проблемных зон",
    "risk_severity": "Оценка степени серьезности каждого риска",
    "additional_check_recommendations": "Рекомендации по дополнительной проверке"
  },
  "section_3": {
    "title": "Инвестиционная привлекательность",
    "financial_health": "Общая оценка финансового состояния компании",
    "opportunities_and_threats": "Потенциальные возможности и угрозы",
    "investment_conclusion": "Выводы для принятия инвестиционных решений",
    "investment_grade": "Вердикт по покупке акций компании, выбери один из следующих вариантов: Покупать/Держать/Продавать"
  }
}

Теперь проанализируй предоставленный документ и верни результат строго в этом формате.`;

export async function analyzeFinancialDocument(documentText: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: FINANCIAL_ANALYSIS_PROMPT,
        },
        {
          role: "user",
          content: documentText,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI returned empty response");
    }

    const parsedData = JSON.parse(content);
    return parsedData;
  } catch (error: any) {
    console.error("OpenAI analysis error:", error);
    throw new Error(`Ошибка анализа документа: ${error.message}`);
  }
}
