const data = {
  "modList": {
    "mod-id": {
      "name": "Mod Name",
      "description": "Mod Description",
      "url": "https://github.com/Author/mod",
      "readme": "https://github.com/Author/mod/README.md",
      "versions": [
        {
          "version": "1.1",
          "download": "https://github.com/Author/mod/releases/1.1"
        },
        {
          "version": "1.0",
          "download": "https://github.com/Author/mod/releases/1.0"
        }
      ]
    }
  }
}

const installed = {
  "installed": {
    "mod-id": {
      "installedVersion": "1.0",
      "pinnedVersion": null,
      "enabled": true,
      "updateAvailable": true
    }
  }
}

// In this scenario the app would ask you if you want to download the 1.1 update


// On startup:
  // Load "data" from web
  // Read "installed" from file on disk

// Every time you launch the game or download a mod:
  // Write "installed" to file on disk


// TODO Auto detect game install path from registry




// Structure:
/*

/anywhere/you/want/OriLauncher                Ori launcher app
/$APPDATA/roaming/OriLauncher/config.json     Settings like "use steam" and "exe path"

/$MODPATH/manifest.json                       "installed" file. Read by launcher and game to determine which mods are enabled.
/$MODPATH/ModLoader/                          Example mod directory
/$MODPATH/InputMod/InputMod.dll               Another example

/steamapps/common/OriDE/oriDE.exe             We launch this in non-steam mode but don't touch anything in its directory

*/