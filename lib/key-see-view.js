"use babel"

import { CompositeDisposable, Disposable } from "atom"

export default class KeySeeView {

  constructor(serializedState){
    // Create root element
    this.element = document.createElement("div")
    this.element.classList.add("key-see")

    // Create message element
    const message = document.createElement("div")
    message.classList.add("message")
    this.element.appendChild(message)
    this.message = message
    this.keyz = []
    this.subscribe()
  }

  showKeyz(){
    this.message.innerHTML = "<div>" + this.keyz.join("</div><div>+") + "</div>"
  }

  addKey(e){
    const index = this.keyz.indexOf(e.code)
    if (index === -1) this.keyz.push(e.code)
    if (index > -1) this.removeKey(e)
    this.showKeyz()
    return this
  }

  removeKey(e){
    console.log(e.code, this.element);
    const index = this.keyz.indexOf(e.code)
    if (index > -1) this.keyz.splice(index, 1)
    this.showKeyz()
    return this
  }

  subscribe(){
    this.subscriptions = new CompositeDisposable()

    const boundAdd = this.addKey.bind(this)
    document.body.addEventListener("keydown", boundAdd)
    this.subscriptions.add(new Disposable(function(){
      document.body.removeEventListener("keydown", boundAdd)
    }))
    const boundRemove = this.removeKey.bind(this)
    document.body.addEventListener("keyup", boundRemove)
    this.subscriptions.add(new Disposable(function(){
      document.body.removeEventListener("keyup", boundRemove)
    }))
    // Keypress makes you hold down teh key a bunch before
    // the key shows. KEYPRESS IS BAD.

    return this
  }

  getTitle() {
    // Used by Atom for tab text
    return "Key See"
  }

  getDefaultLocation(){
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return "right"
  }

  getAllowedLocations(){
    // The locations into which the item can be moved.
    return ["left", "right", "bottom"]
  }

  getURI(){
    // Used by Atom to identify the view when toggling.
    return "atom://key-see"
  }

  // Returns an object that can be retrieved when package is activated
  serialize(){
    return {deserializer: "key-see/KeySeeView"}
  }

  getElement(){
    return this.element
  }

  clearKeys(){
    this.keyz.splice(0, this.keyz.length)
    this.showKeyz()
    return this
  }

  open(){
    this.subscribe()
    return this
  }

  close(){
    this.clearKeys()
    this.subscriptions.dispose()
    return this
  }

  toggle(which){
    this[which]()
  }

  // Tear down any state and detach
  destroy(){
    this.element.remove()
    this.subscriptions.dispose()
  }

}
