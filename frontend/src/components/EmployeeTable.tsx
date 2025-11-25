// components/EmployeeTable.tsx
import { Mail, Phone, MapPin, User, Search } from 'lucide-react';

interface Employee {
  id: number;
  email: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Business Name</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Contact Person</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Phone Number</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Address</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p className="font-medium text-gray-500">No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white font-bold rounded-lg text-sm shadow-sm">
                        #{employee.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {employee.businessName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        {employee.contactPerson}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {employee.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start max-w-xs gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{employee.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {new Date(employee.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {employees.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm p-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-gray-500">No employees found</p>
          </div>
        ) : (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm p-4 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white font-bold rounded-lg text-sm shadow-sm">
                  #{employee.id}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Business Info */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Business Name</p>
                  <p className="font-medium text-gray-900">{employee.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Contact Person</p>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <User className="w-4 h-4 text-gray-400" />
                    {employee.contactPerson}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="pt-3 space-y-2 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {employee.phone}
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{employee.address}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}