import type { Project } from '../data/lorapok';

export function projectSlug(project: Pick<Project, 'name'>) {
  return project.name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
