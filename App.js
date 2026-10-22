import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { INITIAL_PRODUCTS } from './src/data';

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');

  // Estados para el formulario
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [priceMaria, setPriceMaria] = useState('');
  const [priceNorte, setPriceNorte] = useState('');
  const [priceJose, setPriceJose] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Estado para mostrar u ocultar el formulario (evita que tape la pantalla)
  const [showForm, setShowForm] = useState(false);

  // Función para Guardar (Crear o Actualizar)
  const handleSaveProduct = () => {
    if (!newName || !priceMaria || !priceNorte || !priceJose) {
      alert('Por favor complete el nombre y los precios para los tres comercios.');
      return;
    }

    if (editingId) {
      setProducts(
        products.map((item) =>
          item.id === editingId
            ? {
              ...item,
              name: newName,
              category: newCategory || 'General',
              stores: [
                { id: 's1', name: 'Despensa María', price: parseFloat(priceMaria) || 0 },
                { id: 's2', name: 'Supermercado Norte', price: parseFloat(priceNorte) || 0 },
                { id: 's3', name: 'Almacén Don José', price: parseFloat(priceJose) || 0 },
              ],
            }
            : item
        )
      );
    } else {
      const newProduct = {
        id: Date.now().toString(),
        name: newName,
        category: newCategory || 'General',
        stores: [
          { id: 's1', name: 'Despensa María', price: parseFloat(priceMaria) || 0 },
          { id: 's2', name: 'Supermercado Norte', price: parseFloat(priceNorte) || 0 },
          { id: 's3', name: 'Almacén Don José', price: parseFloat(priceJose) || 0 },
        ],
      };
      setProducts([newProduct, ...products]);
    }

    clearForm();
    setShowForm(false); // Cierra el formulario al guardar
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setNewName(item.name);
    setNewCategory(item.category);
    setPriceMaria(item.stores.find((s) => s.id === 's1')?.price.toString() || '');
    setPriceNorte(item.stores.find((s) => s.id === 's2')?.price.toString() || '');
    setPriceJose(item.stores.find((s) => s.id === 's3')?.price.toString() || '');
    setShowForm(true); // Abre el formulario automáticamente al editar
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
    if (editingId === id) {
      clearForm();
    }
  };

  const clearForm = () => {
    setNewName('');
    setNewCategory('');
    setPriceMaria('');
    setPriceNorte('');
    setPriceJose('');
    setEditingId(null);
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Título */}
        <Text style={styles.headerTitle}>🛒 Smart Shopper</Text>
        <Text style={styles.subtitle}>Comparador de precios de barrio</Text>

        {/* Barra de Búsqueda */}
        <TextInput
          style={styles.inputSearch}
          placeholder="Buscar producto (ej. Yerba, Leche)..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        {/* Botón para alternar la visibilidad del formulario */}
        <TouchableOpacity
          style={styles.toggleFormButton}
          onPress={() => {
            setShowForm(!showForm);
            if (showForm) clearForm();
          }}
        >
          <Text style={styles.toggleFormButtonText}>
            {showForm ? '✖️ Ocultar Formulario' : '➕ Agregar / Modificar Producto'}
          </Text>
        </TouchableOpacity>

        {/* Formulario Dinámico (Se muestra solo si showForm es true) */}
        {showForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              placeholderTextColor="#888"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Categoría (ej. Almacén, Bebidas)"
              placeholderTextColor="#888"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio en Despensa María"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={priceMaria}
              onChangeText={setPriceMaria}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio en Supermercado Norte"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={priceNorte}
              onChangeText={setPriceNorte}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio en Almacén Don José"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={priceJose}
              onChangeText={setPriceJose}
            />

            <View style={styles.formButtonsRow}>
              <TouchableOpacity
                style={[styles.addButton, editingId && styles.updateButton]}
                onPress={handleSaveProduct}
              >
                <Text style={styles.addButtonText}>
                  {editingId ? 'Actualizar' : 'Guardar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  clearForm();
                  setShowForm(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Lista de Productos */}
        <Text style={styles.sectionTitle}>
          Listado y Comparativa ({filteredProducts.length})
        </Text>

        {filteredProducts.map((item) => {
          const prices = item.stores.map((s) => s.price);
          const minPrice = Math.min(...prices);

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>

                {/* Botones de Editar y Eliminar */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editActionBtn}
                    onPress={() => handleStartEdit(item)}
                  >
                    <Text style={styles.actionBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteActionBtn}
                    onPress={() => handleDeleteProduct(item.id)}
                  >
                    <Text style={styles.actionBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {item.stores.map((store) => {
                const isCheapest = store.price === minPrice;
                return (
                  <View
                    key={store.id}
                    style={[
                      styles.storeRow,
                      isCheapest && styles.cheapestStoreRow,
                    ]}
                  >
                    <Text style={[styles.storeName, isCheapest && styles.cheapestText]}>
                      {store.name}
                    </Text>
                    <Text style={[styles.storePrice, isCheapest && styles.cheapestText]}>
                      ${store.price.toLocaleString()} {isCheapest && '🏆 (Más barato)'}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputSearch: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 12,
  },
  toggleFormButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleFormButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  formButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#16a34a',
  },
  cancelButton: {
    backgroundColor: '#64748b',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editActionBtn: {
    backgroundColor: '#fef08a',
    padding: 8,
    borderRadius: 6,
  },
  deleteActionBtn: {
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: 14,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  cheapestStoreRow: {
    backgroundColor: '#dcfce7',
  },
  storeName: {
    fontSize: 14,
    color: '#475569',
  },
  storePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  cheapestText: {
    color: '#15803d',
    fontWeight: 'bold',
  },
});