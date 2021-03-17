export namespace Token {
  export function getValue(): string {
    const tkn = window.localStorage.getItem('tkn')
    if(tkn !== null && tkn !== undefined) {
      return tkn
    }
    return ''
  }
  export function setValue(val: string): void {
    window.localStorage.setItem('tkn', val)
  }
  export function removeValue(): void {
    window.localStorage.removeItem('tkn')
  }
}
