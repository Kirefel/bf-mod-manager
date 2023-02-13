function age(mod, version) {
  const includeBeta = isBeta(version)

  var age = 0
  for (let [i, _] of mod.versions.entries()) {
    
    if (version === mod.versions[i].version) {
      return age
    }

    if (!includeBeta && isBeta(mod.versions[i].version)) {
      continue
    }

    age += 1
  }
  return Infinity
}

function latestReleasedVersion(mod) {
  for (let [i, _] of mod.versions.entries()) {
    if (isBeta(mod.versions[i].version)) {
      continue
    }

    return mod.versions[i].version
  }
  return mod.versions[0].version
}

function isBeta(version) {
 return version.includes('alpha') || version.includes('beta')
}

export { age, latestReleasedVersion, isBeta }
