import { APP_STARTUP } from '@state/actions/app'
import { websocketInitRequest } from '@state/actions/websocket'

export const ws = {
  sendMessage: (messageString) => {
    ws._ws.send(messageString)
  }
}

const api = getOrCreateWsClient => store => next => action => {
  if (action.type === APP_STARTUP) {
    store.dispatch(websocketInitRequest()) 
    ws._ws = getOrCreateWsClient(store)
    return next(action)
  }

  if (!action.type.match(/^API:(.*)_REQUEST$/)) {
    return next(action)
  }

  const actionString = JSON.stringify({
    ...action,
    type: action.type.replace('API:', '')
  })
  ws.sendMessage(actionString)

  return next(action)
}

export default api
