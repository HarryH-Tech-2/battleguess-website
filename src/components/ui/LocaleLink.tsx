import { Link, type LinkProps } from 'react-router-dom';
import { useLanguagePrefix } from '../../hooks/useLanguagePrefix';

type LocaleLinkProps = Omit<LinkProps, 'to'> & { to: string };

export function LocaleLink({ to, ...props }: LocaleLinkProps) {
  const { localePath } = useLanguagePrefix();
  return <Link to={localePath(to)} {...props} />;
}
