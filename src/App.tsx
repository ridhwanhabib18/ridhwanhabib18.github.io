import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Chrome';
import { I18nProvider } from './i18n';
import type { Lang } from './content/types';
import Home from './pages/Home';
import Work from './pages/Work';
import WorkDetail from './pages/WorkDetail';
import Experience from './pages/Experience';
import About from './pages/About';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function Shell({ lang }: { lang: Lang }) {
  return (
    <I18nProvider lang={lang}>
      <Layout />
    </I18nProvider>
  );
}

const pages = (
  <>
    <Route index element={<Home />} />
    <Route path="work" element={<Work />} />
    <Route path="work/:slug" element={<WorkDetail />} />
    <Route path="experience" element={<Experience />} />
    <Route path="about" element={<About />} />
    <Route path="resume" element={<Resume />} />
    <Route path="contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell lang="en" />}>
        {pages}
      </Route>
      <Route path="/id" element={<Shell lang="id" />}>
        {pages}
      </Route>
    </Routes>
  );
}
