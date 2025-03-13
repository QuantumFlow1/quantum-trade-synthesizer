
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ResearchLab() {
  const [testElements, setTestElements] = useState<string[]>([]);
  const [newElement, setNewElement] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addElement = () => {
    if (!newElement.trim()) {
      setError('Please enter something to add');
      return;
    }
    
    setTestElements([...testElements, newElement]);
    setNewElement('');
    setError(null);
  };

  const clearElements = () => {
    setTestElements([]);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Research & Testing Lab</CardTitle>
          <CardDescription>
            A controlled environment to test new elements one by one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="new-element">Add a new element</Label>
                <Input
                  id="new-element"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Enter text, component name, or test case"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button onClick={addElement}>Add</Button>
              <Button variant="outline" onClick={clearElements}>Clear All</Button>
            </div>

            <div className="p-4 border rounded-md bg-slate-50 min-h-40">
              <h3 className="text-sm font-medium mb-2">Test Elements ({testElements.length})</h3>
              {testElements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No elements added yet. Use the form above to add test elements.</p>
              ) : (
                <ul className="space-y-2">
                  {testElements.map((element, index) => (
                    <li key={index} className="p-2 bg-white border rounded-md">
                      <div className="flex justify-between items-center">
                        <span>{element}</span>
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing Area</CardTitle>
          <CardDescription>
            This area will display any components or UI elements we want to test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 min-h-40 bg-white">
            {/* Testing area where we'll add more sophisticated components */}
            <p className="text-center text-muted-foreground">Ready for component testing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResearchLab;
