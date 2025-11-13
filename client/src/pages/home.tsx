import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import {
  Panel,
  PanelHeader,
  Group,
  Title,
  Text,
  Placeholder,
  Card,
  CardGrid,
  Div,
  File,
  Button,
} from '@vkontakte/vkui'
import {
  Icon28DocumentOutline,
  Icon28GraphOutline,
  Icon24CheckCircleOn,
  Icon24CancelCircleOutline,
  Icon24ClockOutline,
} from '@vkontakte/icons'
import { queryClient, apiRequest } from '@/lib/queryClient'
import type { FinancialAnalysis } from '@shared/schema'

export default function Home() {
  const [, setLocation] = useLocation()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const { data: analyses, isLoading } = useQuery<FinancialAnalysis[]>({
    queryKey: ['/api/analyses'],
    refetchInterval: 5000, // Refresh list every 5 seconds to pick up status changes
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка загрузки файла')
      }
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/analyses'] })
      setSelectedFile(null)
      if (data.id) {
        setLocation(`/analysis/${data.id}`)
      }
    },
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (
        file.type === 'application/pdf' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword'
      ) {
        setSelectedFile(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Icon24CheckCircleOn fill='var(--vkui--color_icon_positive)' />
      case 'failed':
        return (
          <Icon24CancelCircleOutline fill='var(--vkui--color_icon_negative)' />
        )
      default:
        return <Icon24ClockOutline fill='var(--vkui--color_icon_secondary)' />
    }
  }

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return null

    const colors = {
      Покупать: 'var(--vkui--color_background_positive)',
      Держать: 'var(--vkui--color_background_warning)',
      Продавать: 'var(--vkui--color_background_negative)',
    }

    const textColors = {
      Покупать: 'var(--vkui--color_text_positive)',
      Держать: 'var(--vkui--color_text_warning)',
      Продавать: 'var(--vkui--color_text_negative)',
    }

    return (
      <div
        style={{
          backgroundColor: colors[grade as keyof typeof colors],
          color: textColors[grade as keyof typeof textColors],
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'inline-block',
        }}
      >
        {grade}
      </div>
    )
  }

  return (
    <Panel id='home'>
      <PanelHeader>Финансовый анализ</PanelHeader>

      <Group>
        <Div style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div
            style={{
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              padding: '32px 16px',
            }}
          >
            <Icon28GraphOutline
              width={96}
              height={96}
              fill='var(--vkui--color_icon_accent)'
            />

            <div style={{ textAlign: 'center', maxWidth: '600px' }}>
              <Title
                level='1'
                weight='2'
                style={{ marginBottom: '12px', fontSize: '28px' }}
              >
                Анализ финансовых отчетов
              </Title>
              <Text
                weight='3'
                style={{
                  color: 'var(--vkui--color_text_secondary)',
                  fontSize: '15px',
                }}
              >
                Загрузите финансовый отчет в формате PDF или Word для получения
                детального AI-анализа с оценкой инвестиционной привлекательности
              </Text>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              data-testid='dropzone-upload'
              style={{
                width: '100%',
                maxWidth: '600px',
                minHeight: '280px',
                border: `2px dashed ${
                  dragActive
                    ? 'var(--vkui--color_stroke_accent)'
                    : 'var(--vkui--color_separator_primary)'
                }`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '32px',
                backgroundColor: dragActive
                  ? 'var(--vkui--color_background_secondary)'
                  : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            >
              <Icon28DocumentOutline
                width={64}
                height={64}
                fill='var(--vkui--color_icon_secondary)'
              />

              {selectedFile ? (
                <>
                  <Text
                    weight='2'
                    style={{ fontSize: '15px', textAlign: 'center' }}
                  >
                    {selectedFile.name}
                  </Text>
                  <Text
                    style={{
                      color: 'var(--vkui--color_text_secondary)',
                      fontSize: '13px',
                    }}
                  >
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} МБ
                  </Text>
                  <Button
                    size='l'
                    stretched
                    onClick={handleUpload}
                    loading={uploadMutation.isPending}
                    disabled={uploadMutation.isPending}
                    data-testid='button-upload'
                    style={{ marginTop: '8px' }}
                  >
                    {uploadMutation.isPending
                      ? 'Анализируем документ...'
                      : 'Начать анализ'}
                  </Button>
                  <Button
                    size='m'
                    mode='secondary'
                    onClick={() => setSelectedFile(null)}
                    disabled={uploadMutation.isPending}
                    data-testid='button-cancel'
                  >
                    Отменить
                  </Button>
                </>
              ) : (
                <>
                  <File
                    before={null}
                    size='m'
                    accept='.pdf,.doc,.docx'
                    onChange={handleFileChange}
                    data-testid='input-file'
                  >
                    Выбрать файл
                  </File>
                  <Text
                    style={{
                      color: 'var(--vkui--color_text_secondary)',
                      fontSize: '13px',
                      textAlign: 'center',
                    }}
                  >
                    или перетащите файл сюда
                  </Text>
                  <Text
                    style={{
                      color: 'var(--vkui--color_text_secondary)',
                      fontSize: '13px',
                    }}
                  >
                    Поддерживаются форматы: PDF, DOC, DOCX
                  </Text>
                </>
              )}
            </div>

            {uploadMutation.isError && (
              <div
                style={{
                  backgroundColor: 'var(--vkui--color_background_negative)',
                  color: 'var(--vkui--color_text_negative)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  maxWidth: '600px',
                  width: '100%',
                }}
              >
                <Text weight='2'>Ошибка: {uploadMutation.error?.message}</Text>
              </div>
            )}
          </div>
        </Div>
      </Group>

      <Group
        header={
          <Title
            level='2'
            weight='2'
            style={{ padding: '12px 16px', fontSize: '20px' }}
          >
            История анализов
          </Title>
        }
      >
        {isLoading ? (
          <Div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '48px',
            }}
          >
            <Text data-testid='text-loading-history'>Загрузка...</Text>
          </Div>
        ) : !analyses || analyses.length === 0 ? (
          <Placeholder
            icon={<Icon28DocumentOutline width={56} height={56} />}
            header='История пуста'
            data-testid='placeholder-empty-history'
          >
            Загрузите первый отчет для анализа
          </Placeholder>
        ) : (
          <CardGrid
            size='l'
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}
          >
            {analyses.map((analysis) => {
              const analysisData = analysis.analysisData as any
              const grade = analysisData?.section_3?.investment_grade

              return (
                <Card
                  key={analysis.id}
                  mode='shadow'
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    analysis.status === 'completed' &&
                    setLocation(`/analysis/${analysis.id}`)
                  }
                  data-testid={`card-analysis-${analysis.id}`}
                >
                  <Div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor:
                          'var(--vkui--color_background_secondary)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon28DocumentOutline
                        width={40}
                        height={40}
                        fill='var(--vkui--color_icon_secondary)'
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        weight='2'
                        style={{
                          fontSize: '15px',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {analysis.fileName}
                      </Text>
                      <Text
                        style={{
                          color: 'var(--vkui--color_text_secondary)',
                          fontSize: '13px',
                          marginBottom: '8px',
                        }}
                      >
                        {new Date(analysis.uploadedAt).toLocaleString('ru-RU')}
                      </Text>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {getStatusIcon(analysis.status)}
                          <Text
                            style={{
                              fontSize: '13px',
                              color: 'var(--vkui--color_text_secondary)',
                            }}
                          >
                            {analysis.status === 'completed'
                              ? 'Завершено'
                              : analysis.status === 'failed'
                              ? 'Ошибка'
                              : 'Обработка...'}
                          </Text>
                        </div>
                        {grade && getGradeBadge(grade)}
                      </div>
                    </div>
                  </Div>
                </Card>
              )
            })}
          </CardGrid>
        )}
      </Group>
    </Panel>
  )
}
