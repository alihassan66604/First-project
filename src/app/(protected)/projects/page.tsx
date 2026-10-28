'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, ConfirmDialog, EmptyState, Badge } from '@/components/ui';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-demo-1',
      user_id: 'local-user',
      name: 'Digital Planner 2026 Launch',
      description: 'Etsy shop digital planner keywords, tag ideas, and product descriptions.',
      seed_keywords: ['digital planner', 'weekly schedule', 'habit tracker'],
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'proj-demo-2',
      user_id: 'local-user',
      name: 'Etsy Wedding Stationery Bundle',
      description: 'Printable invitations, RSVP cards, and wedding checklist outline.',
      seed_keywords: ['wedding invitation', 'bridal shower', 'rsvp template'],
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectSeeds, setNewProjectSeeds] = useState('');

  // Delete confirmation state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const seeds = newProjectSeeds.split(/[,]+/).map(s => s.trim()).filter(Boolean);

    const created: Project = {
      id: `proj-${Date.now()}`,
      user_id: 'local-user',
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || null,
      seed_keywords: seeds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProjects(prev => [created, ...prev]);
    setIsCreating(false);
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectSeeds('');
  };

  const confirmDelete = () => {
    if (!projectToDelete) return;
    setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
    setProjectToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Saved Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize research campaigns, keyword lists, Etsy listings, and blog outlines into workspaces.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreating(true)}>
          + New Project
        </Button>
      </div>

      {/* New Project Modal/Card */}
      {isCreating && (
        <Card className="border-brand-300 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-950/20">
          <CardHeader>
            <CardTitle className="text-base">Create New Project</CardTitle>
            <CardDescription>Group keyword research, drafts, and audits under one name.</CardDescription>
          </CardHeader>

          <form onSubmit={handleCreateProject} className="space-y-4">
            <Input
              label="Project Name"
              placeholder="e.g. Minimalist Wall Art Campaign"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
            />

            <Textarea
              label="Project Description (optional)"
              placeholder="Brief summary of target products and goals..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              rows={2}
            />

            <Input
              label="Seed Keywords (comma separated)"
              placeholder="e.g. wall art printable, gallery set, line art"
              value={newProjectSeeds}
              onChange={(e) => setNewProjectSeeds(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Project
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {project.name}
                  </h3>
                  <Badge variant="purple">Active</Badge>
                </div>

                {project.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {project.description}
                  </p>
                )}

                {project.seed_keywords.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <label className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                      Seed Keywords
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {project.seed_keywords.map((seed, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                        >
                          {seed}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                <button
                  type="button"
                  onClick={() => setProjectToDelete(project)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium cursor-pointer"
                >
                  Delete Project
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12">
          <EmptyState
            title="No projects created yet"
            description="Create a project to organize your keyword research, Etsy drafts, and blog outlines together."
            action={
              <Button size="sm" variant="primary" onClick={() => setIsCreating(true)}>
                Create Your First Project
              </Button>
            }
          />
        </Card>
      )}

      {/* Confirmation Dialog before destructive delete */}
      <ConfirmDialog
        open={!!projectToDelete}
        title="Delete Project?"
        description={`Are you sure you want to delete "${projectToDelete?.name}"? All associated research runs and notes within this project will be removed. This action cannot be undone.`}
        confirmLabel="Delete Project"
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
}
