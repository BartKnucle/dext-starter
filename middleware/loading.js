export default function({ store, redirect }) {
  if (!store.state.node.started) {
    return redirect('/')
  }
}
