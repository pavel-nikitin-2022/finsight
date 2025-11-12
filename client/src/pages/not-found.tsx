import { useLocation } from "wouter";
import { Panel, PanelHeader, Placeholder } from "@vkontakte/vkui";
import { Icon28ErrorCircleOutline } from "@vkontakte/icons";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <Panel id="not-found">
      <PanelHeader>Ошибка 404</PanelHeader>
      <Placeholder
        icon={<Icon28ErrorCircleOutline width={56} height={56} />}
        header="Страница не найдена"
        action={
          <div
            onClick={() => setLocation("/")}
            style={{
              color: "var(--vkui--color_text_accent)",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Вернуться на главную
          </div>
        }
      >
        Запрашиваемая страница не существует
      </Placeholder>
    </Panel>
  );
}
