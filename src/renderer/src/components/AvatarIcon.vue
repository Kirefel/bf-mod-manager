<template>
  <q-avatar>
    <img :src="avatarImage" />
  </q-avatar>
</template>
<script>
import avatar0 from '../assets/img/avatar0.png'
import avatar1 from '../assets/img/avatar1.png'
import avatar2 from '../assets/img/avatar2.png'
import avatar3 from '../assets/img/avatar3.png'
import avatar4 from '../assets/img/avatar4.png'
import avatar5 from '../assets/img/avatar5.png'
import avatar6 from '../assets/img/avatar6.png'
import avatar7 from '../assets/img/avatar7.png'
import avatar8 from '../assets/img/avatar8.png'
import avatar9 from '../assets/img/avatar9.png'
import avatar10 from '../assets/img/avatar10.png'
import avatar11 from '../assets/img/avatar11.png'
import avatar12 from '../assets/img/avatar12.png'
import avatar13 from '../assets/img/avatar13.png'
import avatar14 from '../assets/img/avatar14.png'

const images = [
  avatar0,
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14
]

export default {
  setup() {
    return {
      avatarImage: images[Math.floor(Math.random() * 15)]
    }
  }
}
</script>