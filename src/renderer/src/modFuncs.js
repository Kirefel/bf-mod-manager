function age(mod, version) {
  for (let [i, _] of mod.versions.entries()) {
    if (version === mod.versions[i].version) {
      return i
    }
  }
  return Infinity
}

export { age }
