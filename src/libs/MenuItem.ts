import { MenuItem } from "@/types/MenuItem";
import {
  Create,
  PlaylistAddCheck,
  Search
} from '@mui/icons-material';

export const MenuItemList: MenuItem[] = [
  {
    info: {
      name: 'Top',
      link: '/',
    },
    content: []
  },
  {
    info: {
      name: 'ロト7',
      link: ''
    },
    content: [
      {
        title: '出現回検索',
        description: '',
        link: '/search/loto7/appearence',
        icon: Search,
      },
      {
        title: '出現数検索',
        description: '',
        link: '/search/loto7/all_number_appearence',
        icon: Search
      },
      {
        title: '予想',
        description: '',
        link: '/predict/loto7',
        icon: Create
      },
      {
        title: '予想結果',
        description: '',
        link: '/predict/loto7/result',
        icon: PlaylistAddCheck
      }
    ]
  }
]
