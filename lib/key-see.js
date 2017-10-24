"use babel"

import KeySeeView from "./key-see-view"
import { CompositeDisposable, Disposable } from "atom"

export default {

  subscriptions: null,

  activate(state) {
    const ks = this
    ks.isOpen = false

    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === "atom://key-see") {
          ks.view = new KeySeeView()
          return ks.view
        }
      }),

      // Register command that toggles this view
      atom.commands.add("atom-workspace", {
        "key-see:toggle": () => this.toggle()
      }),

      // Destroy any KeySeeViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof KeySeeView) {
            item.destroy()
          }
        })
      })
    )
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  toggle() {
    if (this.isOpen && this.view) {
      this.view.toggle("close")
      this.isOpen = false
    } else if (this.view) {
      this.view.toggle("open")
      this.isOpen = true
    }
    atom.workspace.toggle("atom://key-see")
  },

  deserializeKeySeeView(serialized) {
    this.view = new KeySeeView()
    return this.view
  }

}
