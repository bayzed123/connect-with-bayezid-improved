import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Plus, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProductsManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    image: "",
  });

  // Fetch products
  const { data: products = [], refetch, isLoading } = trpc.products.getAll.useQuery();

  // Mutations
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({ name: "", description: "", category: "", price: "", discountPrice: "", image: "" });
      setIsAddDialogOpen(false);
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
      setFormData({ name: "", description: "", category: "", price: "", discountPrice: "", image: "" });
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      image: product.image || "",
    });
    setEditingId(product.id);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingId(null);
    setFormData({ name: "", description: "", category: "", price: "", discountPrice: "", image: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Products Management</h2>
          <p className="text-slate-400 mt-1">Manage your products and services</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., Web Development Service"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 resize-none"
                    rows={3}
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50"
                      placeholder="e.g., Coding"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    {editingId ? "Update Product" : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-400">
              {products.filter((p) => p.isActive === 1).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">With Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {products.filter((p) => p.discountPrice).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No products yet. Add your first product!</div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="bg-white/10 border-white/20 hover:border-indigo-500/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                      <Badge variant={product.isActive === 1 ? "default" : "secondary"}>
                        {product.isActive === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {product.description && (
                      <p className="text-sm text-slate-400 mb-2 line-clamp-1">{product.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm">
                      {product.category && (
                        <span className="text-slate-400">Category: <span className="text-white">{product.category}</span></span>
                      )}
                      {product.price && (
                        <span className="text-slate-400">Price: <span className="text-indigo-400">${parseFloat(product.price).toFixed(2)}</span></span>
                      )}
                      {product.discountPrice && (
                        <span className="text-slate-400">Discount: <span className="text-green-400">${parseFloat(product.discountPrice).toFixed(2)}</span></span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        if (confirm(`Delete "${product.name}"?`)) {
                          deleteMutation.mutate({ id: product.id });
                        }
                      }}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
