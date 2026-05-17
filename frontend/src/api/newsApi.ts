import axiosInstance from './axiosInstance'

/**
 * Fetch weather-related news (cached via backend)
 */
export const getWeatherNews = (category = 'weather') =>
  axiosInstance.get('/news', { params: { category } })

/**
 * Save an article to the user's saved list
 */
export const saveArticle = (article: {
  title: string
  summary: string
  url: string
  category: string
}) => axiosInstance.post('/news/save', article)
