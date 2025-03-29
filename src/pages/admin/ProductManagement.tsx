
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Star, Edit, Trash2, Plus, AlertTriangle } from "lucide-react";
import { fetchProducts, deleteProduct } from "@/utils/productUtils";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const ProductManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: fetchProducts
  });

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Open delete confirmation dialog
  const handleDeleteClick = (productId: string) => {
    setDeletingProductId(productId);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deleteProduct(deletingProductId);
      
      if (result.success) {
        toast.success("Product deleted successfully");
        // Invalidate and refetch the products data
        queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      } else {
        toast.error(`Failed to delete product: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An unexpected error occurred while deleting the product");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeletingProductId(null);
    }
  };
  
  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingProductId(null);
  };
  
  // Handle edit button click
  const handleEditClick = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button asChild>
            <Link to="/admin/products/add">
              <Plus size={16} className="mr-2" /> Add New Product
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive">Error loading products. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.category}</CardDescription>
                      </div>
                      <Badge>${product.price.toFixed(2)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < product.rating ? "fill-gold text-gold" : "text-muted"}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.isOrganic && <Badge variant="outline" className="text-xs">Organic</Badge>}
                      {product.isNew && <Badge variant="outline" className="text-xs">New</Badge>}
                      {product.origin && <Badge variant="outline" className="text-xs">{product.origin}</Badge>}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(product.id)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => paginate(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center my-4 text-amber-500">
            <AlertTriangle size={64} />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProductManagement;
