import type { App } from 'vue';
import {
  Button,
  Card,
  Cell,
  CellGroup,
  Collapse,
  CollapseItem,
  Dialog,
  Empty,
  FloatingBubble,
  Grid,
  GridItem,
  Icon,
  Image as VanImage,
  List,
  NavBar,
  Search,
  Space,
  Tab,
  Tabs,
  Tag,
  Toast
} from 'vant';

const components = [
  Button,
  Card,
  Cell,
  CellGroup,
  Collapse,
  CollapseItem,
  Empty,
  FloatingBubble,
  Grid,
  GridItem,
  Icon,
  NavBar,
  Search,
  Space,
  Tab,
  Tabs,
  Tag,
  List,
  VanImage
];

export default function installVant(app: App) {
  components.forEach((component) => app.use(component));
  app.use(Toast);
  app.use(Dialog);
}
