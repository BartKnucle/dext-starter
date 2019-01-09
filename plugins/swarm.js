class swarm {
  constructor() {
    this.peers = []
  }
}

export default async ({ app }, inject) => {
  app.swarm = new swarm()
}
